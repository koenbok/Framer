# Import file "NavComponent"
{home, table, back, update, dialog} = 
	Framer.Importer.load("imported/NavComponent@1x")

dialog.borderRadius = 10

nav = new NavComponent
nav.push(home)

home.onTap -> nav.push(table)
back.onTap -> nav.back()
update.onTap -> nav.alert(dialog)