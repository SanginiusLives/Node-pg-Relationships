/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues(node = this.root) {
    if (node === null ) {
      return 0;
    }

    let sum = node.val

    for (const child of node.children) {
      sum += this.sumValues(child)
    }

    return sum

  };

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens(node = this.root) {
    if (node === null) {
      return 0;
    }

    let count = node.val % 2 === 0 ? 1 : 0;

    for (const child of node.children) {
      count += this.countEvens(child);
    }

    return count;
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(lowerBound, node = this.root) {
    if (node === null) {
      return 0
    }

    let count = node.val > lowerBound ? 1 : 0;

    for (const child of node.children) {
      count += this.numGreater(lowerbound, child);
    }

    return count;
  }
}

module.exports = { Tree, TreeNode };
