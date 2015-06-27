sketch = Framer.Importer.load "imported/Test"

scrollA = ScrollComponent.wrap(sketch.ScrollerNoParent)
scrollB = ScrollComponent.wrap(sketch.ScrollerNoMask)

scrollA.scrollHorizontal = false
scrollB.scrollHorizontal = false