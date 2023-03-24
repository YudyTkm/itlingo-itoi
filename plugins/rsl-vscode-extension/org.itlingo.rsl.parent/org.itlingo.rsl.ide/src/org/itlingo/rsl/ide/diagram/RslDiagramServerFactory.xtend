package org.itlingo.rsl.ide.diagram

import org.eclipse.sprotty.xtext.DiagramServerFactory

class RslDiagramServerFactory extends DiagramServerFactory {

	override getDiagramTypes() {
		#['rsl-diagram']
	}
}