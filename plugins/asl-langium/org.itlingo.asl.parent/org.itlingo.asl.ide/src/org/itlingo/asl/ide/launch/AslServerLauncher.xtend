package org.itlingo.asl.ide.launch

import org.eclipse.sprotty.xtext.launch.DiagramServerLauncher

class AslServerLauncher extends DiagramServerLauncher {
	
	override createSetup() {
		new AslLanguageServerSetup
	}

	def static void main(String[] args) {
		new AslServerLauncher().run(args)
	}
}
