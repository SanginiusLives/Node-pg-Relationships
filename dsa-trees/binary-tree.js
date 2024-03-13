/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth(node = this.root) {
    if (node === null) {
      return 0; 
    }

    if (node.left === null && node.right === null) {
      return 1; 
    }

    const leftDepth = node.left ? this.minDepth(node.left) : Infinity;
    const rightDepth = node.right ? this.minDepth(node.right) : Infinity;

    return Math.min(leftDepth, rightDepth) + 1;
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth(node = this.root) {
    if (node === null) {
      return 0;
    }

    if (node.left === null && node.right === null) {
      return 1;
    }

    const leftDepth = node.left ? this.maxDepth(node.left) : 0;
    const rightDepth = node.right ? this.maxDepth(node.right) : 0;

    return Math.max(leftDepth, rightDepth) + 1;
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

 maxSum(node = this.root) {
    if (node === null) {
      return 0;
    }

    let max = -Infinity;

    const dfs = (node) => {
      if (node === null) {
        return 0;
      }

      const leftSum = Math.max(0, dfs(node.left));
      const rightSum = Math.max(0, dfs(node.right));

      max = Math.max(max, leftSum + rightSum + node.val);

      return Math.max(leftSum, rightSum) + node.val;
    };

    dfs(node);

    return max;
  }
  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound, node = this.root) {
    if (node === null) {
      return null;
    }

    let nextLargerValue = null;

    const traverse = (node) => {
      if (node === null) {
        return;
      }

      if (node.val > lowerBound) {
        if (nextLargerValue === null || node.val < nextLargerValue) {
          nextLargerValue = node.val;
        }
      }

      traverse(node.left);
      traverse(node.right);
    };

    traverse(node);

    return nextLargerValue;
  }
  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {
    if (!this.root || !node1 || !node2) {
      return false;
    }

    const getNodeLevelAndParent = (node, parent, level, target) => {
      if (!node) {
        return { level: 0, parent: null };
      }

      if (node === target) {
        return { level, parent };
      }

      return (
        getNodeLevelAndParent(node.left, node, level + 1, target) ||
        getNodeLevelAndParent(node.right, node, level + 1, target)
      );
    };

    const { level: level1, parent: parent1 } = getNodeLevelAndParent(this.root, null, 1, node1);
    const { level: level2, parent: parent2 } = getNodeLevelAndParent(this.root, null, 1, node2);

    return level1 === level2 && parent1 !== parent2;
  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize(tree) {
    if (!tree.root) {
      return '';
    }

    const serializeHelper = (node) => {
      if (!node) {
        return 'null';
      }

      const leftSerialized = serializeHelper(node.left);
      const rightSerialized = serializeHelper(node.right);

      return `${node.val},${leftSerialized},${rightSerialized}`;
    };

    return serializeHelper(tree.root);
  }
  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize(stringTree) {
    if (!stringTree) {
      return null;
    }

    const nodes = stringTree.split(',');
    let index = 0;

    const deserializeHelper = () => {
      if (index >= nodes.length || nodes[index] === 'null') {
        index++;
        return null;
      }

      const node = new BinaryTreeNode(parseInt(nodes[index]));
      index++;

      node.left = deserializeHelper();
      node.right = deserializeHelper();

      return node;
    };

    return deserializeHelper();
  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    const findLCA = (node, p, q) => {
      if (!node || node === p || node === q) {
        return node;
      }

      const left = findLCA(node.left, p, q);
      const right = findLCA(node.right, p, q);

      if (left && right) {
        return node;
      }

      return left ? left : right;
    };

    return findLCA(this.root, node1, node2);
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
