var CACHE_NAME = 'actevo_pwa_cache'

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keyList) {
    var currentCachelist = []
    for (var i = 0; i < keyList.length; i++) {
      var key = keyList[i]
      if (key !== CACHE_NAME) {
        var deletePromise = caches.delete(key)
        currentCachelist.push(deletePromise)
      }
    }
    return Promise.all(currentCachelist)
  }))
})

self.addEventListener('fetch', function (event) {
  if (/http:\/\//.test(event.request.url)) {
    return
  }
  if (event.request.method === 'GET' && /\.(js|css|png|jpg|jpeg|gif|webp|svg|ttf|woff|eot)/.test(event.request.url)) {
    return cacheFirst(event)
  }
})

self.addEventListener('message', function (event) {
  var status = 'FAIL'
  var resParams = {}
  for (var i = 0; i < PALIFE_SERVERWORKER.eventList.length; i++) {
    var target = PALIFE_SERVERWORKER.eventList[i]
    if (target && target.action === event.data.action) {
      status = 'SUCCESS'
      resParams = target.handler(event.data.params)
    }
  }
  var newEventList = []
  for (var j = 0; j < PALIFE_SERVERWORKER.eventList.length; j++) {
    var item = PALIFE_SERVERWORKER.eventList[j]
    if (item.action !== event.data.action) {
      newEventList.push(item)
    }
  }
  PALIFE_SERVERWORKER.eventList = []
  event.source.postMessage({
    status,
    action: event.data.action,
    params: resParams
  })
})

/**
 * 静态资源缓存
 *
 * @param {*} event
 * @returns
 */
function staticCache (event, cache) {
  return fetch(event.request).then(function (networkRes) {
    if (event.request.url.indexOf('chrome-extension://') === -1) {
      cache.put(event.request, networkRes.clone())
    }
    return networkRes.clone()
  })
}
function cacheFirst (event) {
  return event.respondWith(caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(event.request).then(function (cachedRes) {
      if (cachedRes) {
        return cachedRes
      }
      return staticCache(event, cache)
    })
  }))
}

var PALIFE_SERVERWORKER = {
  eventList: [],
  dispatch (event) {
    this.eventList.push(event)
  }
}
