package org.itlingo.rsl.ide.launch

import org.eclipse.sprotty.xtext.launch.DiagramServerSocketLauncher

class RslSocketServer extends DiagramServerSocketLauncher {

	override createSetup() {
		new RslLanguageServerSetup
	}

	def static void main(String... args) {
		new RslSocketServer().run(args)
	}
}
