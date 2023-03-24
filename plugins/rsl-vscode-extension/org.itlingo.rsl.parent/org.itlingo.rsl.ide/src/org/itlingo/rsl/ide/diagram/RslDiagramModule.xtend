package  org.itlingo.rsl.ide.diagram

import org.eclipse.sprotty.xtext.DefaultDiagramModule
import org.eclipse.sprotty.xtext.IDiagramGenerator
import org.itlingo.rsl.ide.diagram.RslDiagramGenerator
import org.itlingo.rsl.ide.diagram.RslLayoutEngine


class RslDiagramModule extends DefaultDiagramModule {
	
	def Class<? extends IDiagramGenerator> bindIDiagramGenerator() {
		RslDiagramGenerator
	} 
	
	override bindIDiagramServerFactory() {
		RslDiagramServerFactory
	}
	
	override bindILayoutEngine() {
		RslLayoutEngine
	}
	
	override bindIDiagramServer() {
		RslDiagramServer
	}	
}
