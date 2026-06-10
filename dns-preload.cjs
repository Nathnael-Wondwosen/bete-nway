const dns = require('dns');
const googleResolver = new dns.Resolver();
googleResolver.setServers(['8.8.8.8', '8.8.4.4']);

function patchCallback(method) {
  const original = dns[method];
  if (!original) return;
  dns[method] = function (name) {
    const args = Array.prototype.slice.call(arguments, 1);
    const callback = args.pop();
    original.call(dns, name, ...args, (err, result) => {
      if (!err) return callback(err, result);
      googleResolver[method](name, ...args, (gErr, gResult) => {
        callback(gErr || err, gErr ? result : gResult);
      });
    });
  };
}

function patchPromise(method) {
  const original = dns.promises && dns.promises[method];
  if (!original) return;
  dns.promises[method] = async function (name) {
    const args = Array.prototype.slice.call(arguments, 1);
    try {
      return await original.call(dns.promises, name, ...args);
    } catch (e) {
      return new Promise((resolve, reject) => {
        googleResolver[method](name, ...args, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
  };
}

patchCallback('resolveSrv');
patchCallback('resolveTxt');
patchCallback('resolve4');
patchCallback('resolve');
patchPromise('resolveSrv');
patchPromise('resolveTxt');
patchPromise('resolve4');
patchPromise('resolve');

const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') { callback = options; options = {}; }
  originalLookup.call(dns, hostname, options, (err, address, family) => {
    if (!err) return callback(err, address, family);
    googleResolver.resolve4(hostname, (gErr, addresses) => {
      if (gErr) return callback(err, address, family);
      callback(null, addresses[0], 4);
    });
  });
};

console.log('[dns-preload] DNS patched with Google 8.8.8.8 fallback (including dns.promises.resolve)');
