# Use desktop cursor
document.body.style.cursor = "auto"

x = new WindowComponent
x.onResize -> print(this.size)
