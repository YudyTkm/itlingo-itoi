package org.itlingo.rsl.ide.diagram.custom;

import java.util.ArrayList;
import java.util.function.Consumer;

import org.eclipse.sprotty.SButton;
import org.eclipse.sprotty.SGraph;
import org.eclipse.sprotty.SModelElement;

public class ActionSButton extends SButton{
	ArrayList<SModelElement> toggleVisibilityList;
	SGraph graph;
	public ActionSButton(ArrayList<SModelElement> _toggleVisibilityList,SGraph _sgraph) {
		super();
		toggleVisibilityList = _toggleVisibilityList;
		
	}
	
	public ActionSButton(Consumer<SButton> initializer, ArrayList<SModelElement> _toggleVisibilityList,SGraph _sgraph) {
		super(initializer);
		toggleVisibilityList = _toggleVisibilityList;
	}
	
	protected void toggleVisibility() {
		for (SModelElement sElement : toggleVisibilityList) {
			graph.getChildren().add(sElement);
		}
		graph.getChildren().remove(this);
	}
	
	
	

}
