'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var {LazyTreeNode} = require('nuclide-ui-tree');

class LazyFileTreeNode extends LazyTreeNode {

  _file: (atom$File | atom$Directory);

  constructor(
      file: atom$File | atom$Directory,
      parent: ?LazyFileTreeNode,
      fetchChildren: (node: LazyTreeNode) => Promise) {
    super(file, parent, file.isDirectory(), fetchChildren);
    this._file = file;
    this._key = null;
  }

  /**
   * @return a sorted list where directories appear before files and items
   *     are alphabetized by base name within their own type.
   */
  getCachedChildren(): ?Immutable.List<LazyTreeNode> {
    return super.getCachedChildren();
  }

  getKey(): string {
    if (!this._key) {
      var label = this._parent ? this._parent.getKey() + this.getLabel() : this._file.getPath();
      var suffix = this._isContainer && !label.endsWith('/') ? '/' : '';
      this._key = label + suffix;
    }
    return this._key;
  }

  getLabel(): string {
    return this._file.getBaseName();
  }

  isSymlink(): boolean {
    // The `symlink` property is assigned in the atom$Directory and atom$File
    // constructors with the `@symlink` class property syntax in its argument
    // list.
    return this._file.symlink;
  }

}

module.exports = LazyFileTreeNode;
