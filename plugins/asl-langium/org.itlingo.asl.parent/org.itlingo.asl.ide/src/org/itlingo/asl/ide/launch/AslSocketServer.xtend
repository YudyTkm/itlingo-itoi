package org.itlingo.asl.ide.launch

import org.eclipse.sprotty.xtext.launch.DiagramServerSocketLauncher

class AslSocketServer extends DiagramServerSocketLauncher {

	override createSetup() {
		new AslLanguageServerSetup
	}

	def static void main(String... args) {
		new AslSocketServer().run(args)
	}
}
