## reactive

### feature

* lazy recursive proxy object
  * array add value(push)
  * array set value(by index)
* cache has proxy object

### array

* update by index
* update by length
  * length not used in html , only to update array
  * length used in html to display array's count
* update by method


* `JSON.stringify` will access each property of array and object
  * render in html always use `JSON.stringify` so that it will trigger get method of proxy
  * proxy.arr[1] = 100

### ref

* Object.defineProperty
