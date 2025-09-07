//component to show each member in tree structure

import React, { useState, useEffect, useCallback } from 'react';
import Tree from 'react-d3-tree';              //Imports the tree rendering library which draws a hierarchical SVG tree and allows custom node rendering.
import type { FamilyTreeData } from '@/types/family';
import { FamilyTreeNode } from './FamilyTreeNode';          //card/node for each member
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';   //RotateCcw icon for reset
// import { Maximize2 } from 'lucide-react';
import { memberServices } from '@/services/memberServices';
import { buildFamilyTree } from '@/utils/transform';


// pops interface for what the FamilyTree component receives
interface FamilyTreeProps {
  treeData: FamilyTreeData;
  onNodeClick?: (nodeData: FamilyTreeData) => void;           //optional, fired when a node is clicked(pass this down to FamilyTreeNode)
}



export const FamilyTree: React.FC<FamilyTreeProps> = ({
  //  treeData, 
  onNodeClick
}) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });             //to change the position of tree
  const [zoom, setZoom] = useState(0.8);    // initially 80%                              // starting = 0.8 = 80% 
  const [treeRef, setTreeRef] = useState<HTMLDivElement | null>(null);    // Stores a reference to the container DOM element (the div that holds the tree).
  const [treeData, setTreeData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch data feom backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const members = await memberServices.getMembers();  //API call
      const tree = buildFamilyTree(members);     //build tree
             if (tree.length > 0) {
        setTreeData(tree[0]);
      } else {
        setTreeData(null);
      }

      } catch (err) {
        console.error("Error fetching family tree:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  // Custom node rendering, renders each member calling FamilyTreeNode
  const renderCustomNode = useCallback((rd3tProps: any) => {
    return (
      <FamilyTreeNode
        nodeDatum={rd3tProps.nodeDatum}   // data passed to FamilyTreeNode
        onNodeClick={onNodeClick}
      />
    );
  }, [onNodeClick]);



  // Center the tree when component mounts,,,, this runs after the components renders(or when treeRef changes)
  useEffect(() => {
    if (treeRef) {              // treeRef is div containing tree structure
      const dimensions = treeRef.getBoundingClientRect();    //getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport
      setTranslate({
        x: dimensions.width / 2,      // horizontally center the root of the tree.  dimension as an object with fields-> width ,height, top, left, right, buttom
        y: dimensions.height / 4     //  position the tree vertically, push tree down
      });
    }
  }, [treeRef]);


  // zoom control
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));    // zoomOut by 0.1, but upto max 2(200%)
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));  // zoomIn by 0.1, but upto min 0.3(30%)
  };


  // handles reset when reset icon is clicked
  const handleReset = () => {
    setZoom(0.8);                                              // set to initial --> 80%
    if (treeRef) {                                            // to recalculate translate to re-center the tree
      const dimensions = treeRef.getBoundingClientRect();
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 4
      });
    }
  };


  if(loading) return  <p>Loading family tree...</p>;
  if(!treeData) return <p>No family data available</p>

  return (
    <Card className="w-full h-full pb-0 border-0 shadow-[gray]">    {/*outer card */}
      <CardHeader className="pb-0">                        {/*inner's upper header part */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-family bg-clip-text text-transparent">
            Family Tree
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="bg-amber-100 p-0">        {/*below than header ---> tree structure part */}
        <div
          ref={setTreeRef}
          className="w-full h-[600px] bg-gradient-warm rounded-lg border overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          {/* react-d3-tree component with props */}
          <Tree
            data={treeData}
            translate={translate}
            zoom={zoom}
            orientation="vertical"
            pathFunc="step"
            renderCustomNodeElement={renderCustomNode}
            separation={{ siblings: 1.75, nonSiblings: 2.5 }}
            nodeSize={{ x: 220, y: 180 }}     //separetion between node
            zoomable={true}
            draggable={true}
            collapsible={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};