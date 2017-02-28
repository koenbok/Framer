#!/usr/bin/end awk

BEGIN {
    print "declare module Framer {"
}
END {
    print "}"
    print ""
    print "declare var Layer: {"
    print "    prototype: Framer.Layer;"
    print "    new(options?: Framer.LayerOptions): Framer.Layer;"
    print "}"
}

/declare module "src\/Types"/ {
    printBrace = 1
    print "export module Types {"
    next
}

# for now to make it work
/declare module .*EventEmitter.old/ { skipUntilBrace = 1 }
/declare module .*PreactRenderer/ { skipUntilBrace = 1 }
/assignStyles/   { print "// SKIP " $0; next }


/^}$/ {
    if (printBrace) {
        printBrace = 0
        print $0 " // ENDING BRACE"
    } else {
        skipUntilBrace = 0
        print "// SKIP " $0
    }
    next
}

skipUntilBrace   { print "// SKIP " $0; next }
/export [{*]/    { print "// SKIP " $0; next }
/declare module/ { print "// SKIP " $0; next }
/import.*from/   { print "// SKIP " $0; next }
//               { print $0 }
