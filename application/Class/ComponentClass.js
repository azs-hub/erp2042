"use strict";

console.log('--- ComponentClass.js ---');
/**
 * ComponentClass.
 */
function getPath(val, name) {
    name = name || "";
    if (val.parent) {
        return getPath(val.parent, val.name + '/' + name);
    }
    return name;
}

function ComponentClass(name, parent) {
    AppClass.call(this);

    var fs = new FileSystemClass();

    this.name = name;
    this.parent = parent;
    this.path = getPath(this);

    if (this.parent instanceof ComponentDirectoryClass) {
        if (this.parent !== null) {
            this.parent.addChild(this);
        }
        fs.setDirectory(this.path)
        .createDirectory();
    }
    if (this instanceof ComponentFileClass) {
        fs.setFile(this.path)
        .createFile();
    }
}
ComponentClass.inherits(AppClass);

ComponentClass.prototype = {

    getName: function ()
    {
        return this.name;
    },

    getParent: function ()
    {
        return this.parent;
    },

    setName: function (name)
    {
        this.name = name;
    },

    setParent: function (parent)
    {
        if (parent instanceof ComponentDirectoryClass) {
            this.parent = parent;
        }
    }

};

/**
 * ComponentFileClass.
 */
function ComponentFileClass(name, parent) {
    ComponentClass.call(this, name, parent);
}
ComponentFileClass.inherits(ComponentClass);

ComponentFileClass.prototype = {

    setParent: function (parent)
    {
        ComponentClass.prototype.setParent.apply(this, parent);
    }

};

/**
 * ComponentDirectoryClass.
 */
function ComponentDirectoryClass(name, parent) {
    ComponentClass.call(this, name, parent);

    this.children = [];
}
ComponentDirectoryClass.inherits(ComponentClass);

ComponentDirectoryClass.prototype = {

    getName: function ()
    {
        return ComponentClass.prototype.getName.apply(this);
    },

    getChildren: function ()
    {
        return this.children;
    },

    setChildren: function (childs)
    {
        this.children = childs;
    },

    setParent: function (parent)
    {
        ComponentClass.prototype.setParent.apply(this, parent);
    },

    addChild: function (child)
    {
        if (child instanceof ComponentDirectoryClass || child instanceof ComponentFileClass) {
            child.setParent(this);
            this.children.push(child);
        } else {
            throw 'The child must be an instance of the ComponentDirectoryClass or ComponentFileClass class!';
        }
    },

    showChildrenTree: function(output, level)
    {
        var repeat = "--";
        var childs = this.getChildren();

        output += "\n" +  repeat.repeat(level) + this.getName();

        for (var i = 0; i < childs.length; i++) {
            if (childs[i] instanceof ComponentDirectoryClass) {
                output += childs[i].showChildrenTree(' ', level + 1);
            } else {
                output += "\n" +  repeat.repeat(level + 1) + this.getName();
            }
        }

        return output;
    }

};