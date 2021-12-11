self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open("cache")
      .then(function(cache) {
        return cache.addAll([
          '/favicon',
        ]);
      })
      .then(function() {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);

        return cached || networked;

        function fetchedFromNetwork(response) {
          return response;
        }

        function unableToResolve () {
          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});
