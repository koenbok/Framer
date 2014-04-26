viewA = new ScrollView x:20, y:20, width:100, height:100
viewB = new View x:20, y:20, width:100, height:100, superView:viewA

viewC = viewA.copy()

viewC.y = 200
