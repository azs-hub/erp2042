"use strict";

console.log('--- FileSystemClass.js ---');

function FileSystemClass() {
    AppClass.call(this);

    this.storageType = window.PERSISTENT;
    this.size = 1024*1024;
    this.callbackCreateDirectorySuccess = this.doCreateDirectory;
    this.callbackDoCreateDirectorySuccess = this.createDoDirectoryCallbackSuccess;
    this.callbackDoCreateDirectoryError = this.createDoDirectoryCallbackError;
    this.callbackCreateFileSuccess = this.doCreateFile;
    this.callbackDoCreateFileSuccess = this.createDoFileCallbackSuccess;
    this.callbackDoCreateFileError = this.createDoFileCallbackError;
    this.callbackWriteFile = this.writeFile;
}
FileSystemClass.inherits(AppClass);

FileSystemClass.prototype = {

    /**
     * SETTERS
     */

    setStorageType: function (storageType)
    {
        this.storageType = storageType;

        return this;
    },

    setSize: function (size)
    {
        this.size = size;

        return this;
    },

    setDirectory: function (directory)
    {
        this.directory = directory;

        return this;
    },

    setFile: function (file)
    {
        this.file = file;

        return this;
    },

    setCallbackInitSuccess: function (callbackInitSuccess)
    {
        this.callbackInitSuccess = callbackInitSuccess;

        return this;
    },

    setCallbackInitError: function (callbackInitError)
    {
        this.callbackInitError = callbackInitError;

        return this;
    },

    setCallbackCreateDirectorySuccess: function (callbackCreateDirectorySuccess)
    {
        this.callbackCreateDirectorySuccess = callbackCreateDirectorySuccess;

        return this;
    },

    setCallbackCreateDirectoryError: function (callbackCreateDirectoryError)
    {
        this.callbackCreateDirectoryError = callbackCreateDirectoryError;

        return this;
    },

    /**
     * GETTERS
     */

    getStorageType: function ()
    {
        return this.storageType;
    },

    getSize: function ()
    {
        return this.size;
    },

    getDirectory: function ()
    {
        return this.directory;
    },

    getFile: function ()
    {
        return this.file;
    },

    getCallbackCreateDirectorySuccess: function ()
    {
        return this.callbackCreateDirectorySuccess.bind(this);
    },

    getCallbackCreateDirectoryError: function()
    {
        return this.callbackCreateDirectoryError.bind(this);
    },

    getCallbackCreateFileSuccess: function ()
    {
        return this.callbackCreateFileSuccess.bind(this);
    },

    getCallbackCreateFileError: function()
    {
        return this.callbackCreateFileError.bind(this);
    },

    getCallbackDoCreateDirectorySuccess: function ()
    {
        return this.callbackDoCreateDirectorySuccess.bind(this);
    },

    getCallbackDoCreateDirectoryError: function ()
    {
        return this.callbackDoCreateDirectoryError.bind(this);
    },

    getCallbackDoCreateFileSuccess: function ()
    {
        return this.callbackDoCreateFileSuccess.bind(this);
    },

    getCallbackDoCreateFileError: function ()
    {
        return this.callbackDoCreateFileError.bind(this);
    },

    getCallbackWriteFile: function ()
    {
        return this.callbackWriteFile.bind(this);
    },

    /**
     * CALLBACKS
     */

    createDoDirectoryCallbackSuccess: function ()
    {
        console.log('FileSystemAsyncClass::createDoDirectoryCallbackSuccess');
    },

    createDoDirectoryCallbackError: function ()
    {
        console.log('FileSystemAsyncClass::createDoDirectoryCallbackError');
    },

    createDoFileCallbackSuccess: function ()
    {
        console.log('FileSystemAsyncClass::createDoFileCallbackSuccess');
    },

    createDoFileCallbackError: function ()
    {
        console.log('FileSystemAsyncClass::createDoFileCallbackError');
    },

    doCreateDirectory: function (fs)
    {
        var self = this;

        console.log('FS');
        console.log(fs);

        console.log('THIS');
        console.log(this);

        console.log('FileSystemAsyncClass::doCreateDirectory - ' + self.getDirectory());

        fs.root.getDirectory(
            self.getDirectory(),
            { create: true },
            self.getCallbackDoCreateDirectorySuccess(),
            self.getCallbackDoCreateDirectoryError()
        );
    },

    writeFile: function (fileEntry)
    {
        var self = this;

        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function (e) {
                console.log('Write completed.');
            };

            fileWriter.onerror = function (e) {
                console.log('Write failed: ' + e.toString());
            };

            var bb = new BlobBuilder();

            bb.append('Meow');

            fileWriter.write(bb.getBlob('text/plain'));

        }, self.getCallbackDoCreateFileError.bind(self))
    },

    doCreateFile: function (fs)
    {
        var self = this;

        console.log('FS');
        console.log(fs);

        console.log('THIS');
        console.log(this);

        console.log('FileSystemAsyncClass::doCreateFile - ' + self.getFile());

        fs.root.getFile(
            self.getFile(),
            { create: true },
            self.getCallbackWriteFile().bind(self)
        );
    },

    /**
     * Do the job.
     */

    createDirectory: function ()
    {
        var self = this;

        console.log('FileSystemAsyncClass::createDirectory');
        console.log(self);

        window.requestFileSystem  = window.webkitRequestFileSystem;
        // window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

        //self.getCallbackInitSuccess().bind(this);

        window.requestFileSystem(
            self.getStorageType(),
            self.getSize(),
            self.getCallbackCreateDirectorySuccess.bind(self),
            self.getCallbackCreateDirectoryError.bind(self)
        );
    },

    createFile: function ()
    {
        var self = this;

        console.log('FileSystemAsyncClass::createFile');
        console.log(self);

        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

        window.requestFileSystem(
            self.getStorageType(),
            5*1024*1024,
            self.getCallbackDoCreateFileSuccess().bind(self),
            self.getCallbackDoCreateFileError().bind(self)
        );
    }
};


// var fs = new FileSystemClass();

// fs
//     .setDirectory('Documents')
//     .createDirectory()
// ;
// fs
//     .setFile('Documents/file')
//     .createFile()
// ;