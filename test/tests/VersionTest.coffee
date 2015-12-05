describe "Version", ->

	describe "Version", ->

		it "should have a branch", ->
			(typeof Framer.Version.branch).should.equal "string"
			Framer.Version.branch.length.should.be.above(1)

		it "should have a hash", ->
			(typeof Framer.Version.hash).should.equal "string"
			Framer.Version.branch.length.should.be.above(5)

		it "should have a build", ->
			(typeof Framer.Version.build).should.equal "number"

		it "should have a date", ->
			(typeof Framer.Version.date).should.equal "number"