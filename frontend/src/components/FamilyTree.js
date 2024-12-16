import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const FamilyTree = ({ persons, relationships }) => {
  const treeRef = useRef();

  useEffect(() => {
    console.log("Persons data:", persons);
    console.log("Relationships data:", relationships);

    // Clear previous tree if it exists
    d3.select(treeRef.current).select("svg").remove();

    // Build the tree data structure
    const data = buildTree(persons, relationships);

    const width = 800;
    const height = 600;
    const svg = d3
      .select(treeRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g").attr("transform", "translate(50, 50)");

    // Create a tree layout
    const treeLayout = d3.tree().size([height - 100, width - 100]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    // Draw links between nodes (representing relationships)
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.y)
      .attr("y1", (d) => d.source.x)
      .attr("x2", (d) => d.target.y)
      .attr("y2", (d) => d.target.x)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    // Draw circles for each person node (with dynamic colors and sizes)
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("r", (d) => 10 + d.depth * 3) // Make node size dynamic based on depth
      .attr("cx", (d) => d.y)
      .attr("cy", (d) => d.x)
      .attr("fill", (d) => d.depth === 0 ? "#69b3a2" : "#ff7f0e") // Different colors for root and others
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#d62728"); // Change color on hover
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", (d) => d.depth === 0 ? "#69b3a2" : "#ff7f0e"); // Reset color on mouseout
      });

    // Add labels for each node
    g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("text")
      .text((d) => d.data.name)
      .attr("x", (d) => d.y + 15)  // Adjust text position
      .attr("dy", 3)
      .attr("font-size", "12px")
      .attr("fill", "black");

    // Implement zoom and pan functionality
    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg.call(zoom); // Apply zoom to the entire SVG

  }, [persons, relationships]);

  // Helper function to build the hierarchical tree
  const buildTree = (persons, relationships) => {
    if (!persons || persons.length === 0) {
      console.error("No valid persons data available.");
      return { name: "No Data", children: [] };
    }

    const personMap = {};
    persons.forEach((person) => {
      personMap[person.id] = { ...person, children: [] };
    });

    relationships.forEach((rel) => {
      if (personMap[rel.person1_id] && personMap[rel.person2_id]) {
        personMap[rel.person1_id].children.push(personMap[rel.person2_id]);
      }
    });

    return personMap[persons[0].id] || { name: "Root", children: [] };
  };

  return <div ref={treeRef}></div>;
};

export default FamilyTree;
