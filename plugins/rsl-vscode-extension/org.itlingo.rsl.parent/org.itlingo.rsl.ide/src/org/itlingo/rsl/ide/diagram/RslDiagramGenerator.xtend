package org.itlingo.rsl.ide.diagram

import java.util.ArrayList
import org.eclipse.sprotty.LayoutOptions
import org.eclipse.sprotty.SButton
import org.eclipse.sprotty.SEdge
import org.eclipse.sprotty.SGraph
import org.eclipse.sprotty.SLabel
import org.eclipse.sprotty.SModelElement
import org.eclipse.sprotty.SNode
import org.eclipse.sprotty.xtext.IDiagramGenerator
import org.itlingo.rsl.ide.diagram.custom.ActionSButton
import org.itlingo.rsl.rsl.View
import org.itlingo.rsl.rsl.Actor

class RslDiagramGenerator implements IDiagramGenerator {
	
	
	override generate(Context context) {
		println("generating diagram oi oi")
		val layoutopts =  new LayoutOptions [
				paddingTop = 10.0
				paddingBottom = 10.0
				paddingLeft = 10.0
				paddingRight = 10.0
				
		]
		val graph = new SGraph
		graph.setId("Demo_graph");
		val node1 = new SNode
		node1.id = "Demo_node1"
		node1.children = #[new SLabel[
			id='1.label'
			text = "demoText1"
		]]
		node1.layoutOptions = layoutopts
		val node2 = new SNode
		node2.id = "Demo_node2"
		node2.children = #[new SLabel[
			id='2.label'
			text = "demoText2"
		]]
		
		node2.layoutOptions = layoutopts
		val edge = new SEdge
		edge.sourceId = "Demo_node1"
		edge.targetId = "Demo_node2"
		graph.children = new ArrayList<SModelElement>
		graph.children += #[node1, node2, edge]
		
		val buttons = new ArrayList<SButton>
		
		val resource = context.resource
		resource.allContents.forEach[element | 
			if (element instanceof View) {
				
				
				val v = element as View
				if (v.type.type == 'ActorView') {
					val sModelElementList = new ArrayList<SModelElement> 
					v.elements.references.forEach[system |
						val actor = system as Actor
						
						
						val node = new SNode
						node.id = actor.toString
						node.layoutOptions = layoutopts
						node.children  = new ArrayList<SModelElement>
						node.children += #[new SLabel[text = actor.nameAlias]]
						sModelElementList += node
						
						if (actor.super !== null){
							val isASuperEdge = new SEdge
							isASuperEdge.sourceId = actor.toString
							isASuperEdge.targetId = actor.super.toString
							sModelElementList += isASuperEdge
						}
					]
					
					

					val node = new SNode
					node.id = v.toString
					node.layoutOptions = layoutopts
					node.children  = new ArrayList<SModelElement>
					node.children += #[new SLabel[text = v.nameAlias]]
					node.layoutOptions = layoutopts
					graph.children += node
					
					
					sModelElementList.forEach[sModel |
						graph.children += sModel
					]
				}
				 
			}
		]
		
		graph.children += buttons
		
		return graph
		//(context.resource.contents.head as PackageAbstract).toSGraph(context)
	}
}