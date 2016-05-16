#Import file "NavComponent"
{home, Unlock, table, back, update, dialog} = 
	Framer.Importer.load("imported/NavComponent@1x")

dialog.borderRadius = 10

nav = new NavComponent height:Screen.height
nav.push(home)

Unlock.onTap -> nav.push(table)
back.onTap -> nav.back()
update.onTap -> nav.alert(dialog)