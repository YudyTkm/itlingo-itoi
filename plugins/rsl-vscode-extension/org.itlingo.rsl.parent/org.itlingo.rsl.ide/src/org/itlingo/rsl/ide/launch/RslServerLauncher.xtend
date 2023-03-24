package org.itlingo.rsl.ide.launch

import org.eclipse.sprotty.xtext.launch.DiagramServerLauncher

class RslServerLauncher extends DiagramServerLauncher {
	
	override createSetup() {
		new RslLanguageServerSetup
	}

	def static void main(String[] args) {
		new RslServerLauncher().run(args)
	}
}
