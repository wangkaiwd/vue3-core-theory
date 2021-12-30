## runtime-core

* [What is `VNode`?](https://v3.vuejs.org/guide/render-function.html#the-virtual-dom-tree)

### diff algorithm

1. [sync from start](https://excalidraw.com/#json=f6GVu22ItXpVqFa_1V_3F,FMDYgdAHAEjGTfQVrveAAw)
   ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/sync-from-start.png)
2. [sync from end](https://excalidraw.com/#json=-RnZwHgQ3Ug7tNHehWoDy,jUB6MHMjorxqPzvydCgizg)
   ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/sync-from-end.png)
3. [random order](https://excalidraw.com/#json=QuK4Ii5ESCINu1C63-aCB,ENhd3uys8G9TqBRwMAmFXQ)

demo:

* A B C D -> A B E C D
