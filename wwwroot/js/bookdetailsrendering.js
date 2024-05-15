var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AutoCompleteHelper = /** @class */ (function () {
    function AutoCompleteHelper() {
        this.tableElement = null;
        this.dialogInstance = null;
    }
    AutoCompleteHelper.prototype.initializeLayout = function () {
        this.dialogInstance = new DialogHelper();
        this.renderContainer($("#containers"));
        this.ajaxFunction();
        this.wireEvents();
    };
    AutoCompleteHelper.prototype.editData = function () {
        var bookID = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[0].innerHTML;
        var bookName = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[1].innerHTML;
        var author = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[2].innerHTML;
        var publishedYear = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[3].innerHTML;
        var publishedBy = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[4].innerHTML;
        var data = {
            BookID: bookID, BookName: bookName, Author: author, PublishedYear: publishedYear, PublishedBy: publishedBy
        };
        this.dialogInstance.showEditAddDialog(data, true);
    };
    AutoCompleteHelper.prototype.addData = function () {
        this.dialogInstance.showEditAddDialog(null, false);
    };
    AutoCompleteHelper.prototype.wireEvents = function () {
        $("#delete_btn").bind('click', $.proxy(this.dialogInstance.deleteData, this.dialogInstance));
        $("#edit_btn").bind('click', $.proxy(this.editData, this));
        $("#add_btn").bind('click', $.proxy(this.addData, this));
    };
    AutoCompleteHelper.prototype.renderContainer = function (target) {
        var div = this.buildElement("div", "container", "containner1", null, {}, null);
        target.append(div);
        this.renderTable(div);
    };
    AutoCompleteHelper.prototype.renderTable = function (target) {
        var table = this.buildElement("table", null, "table_tag", null, {}, {});
        target.append(table);
        var divHeader = this.buildElement("div", "table_header", "table_header_div", null, {}, {});
        table.append(divHeader);
        var divBody = this.tableElement = this.buildElement("div", "table_body", "table_body_div", null, {}, {});
        table.append(divBody);
        this.renderTableHeader(divHeader);
    };
    AutoCompleteHelper.prototype.renderTableHeader = function (target) {
        var tableRow = this.buildElement("tr", "table_heading_buttons", "table_row_tag", null, {}, null);
        target.append(tableRow);
        var headingRow = this.buildElement("tr", "table_title", "table_row_heading_tag", null, {}, null);
        target.append(headingRow);
        this.renderLayoutHeader(tableRow);
        this.tableHeader(headingRow);
    };
    AutoCompleteHelper.prototype.renderLayoutHeader = function (target) {
        var tableHeading = this.buildElement("th", null, "table_heading_tag", null, {}, null);
        target.append(tableHeading);
        var addButton = this.buildElement("input", "heading_button", "add_btn", null, {}, { 'type': 'button', 'value': 'Add' });
        var editButton = this.buildElement("input", "heading_button", "edit_btn", null, {}, { 'type': 'button', 'value': 'Edit' });
        var deleteButton = this.buildElement("input", "heading_button", "delete_btn", null, {}, { 'type': 'button', 'value': 'Delete' });
        tableHeading.append(addButton);
        tableHeading.append(editButton);
        tableHeading.append(deleteButton);
    };
    AutoCompleteHelper.prototype.tableHeader = function (target) {
        var bookID = this.buildElement("th", "table_heading", "bookID", "BOOK_ID", {}, null);
        target.append(bookID);
        var bookName = this.buildElement("th", "table_heading", "bookName", "BOOK NAME", {}, null);
        target.append(bookName);
        var author = this.buildElement("th", "table_heading", "author", "AUTHOR", {}, null);
        target.append(author);
        var publishedYear = this.buildElement("th", "table_heading", "publishedYear", "PUBLISHED YEAR", {}, null);
        target.append(publishedYear);
        var publishedBy = this.buildElement("th", "table_heading", "publishedBy", "PUBLISHED BY", {}, null);
        target.append(publishedBy);
    };
    AutoCompleteHelper.prototype.insertTableData = function (target, data) {
        var getBookID = this.buildElement("td", "table_data", null, "".concat(data), {}, null);
        target.append(getBookID);
    };
    AutoCompleteHelper.prototype.insertTableRow = function (target, data) {
        var tabledatarow = this.buildElement("tr", "data_row", null, null, {}, null);
        target.append(tabledatarow);
        tabledatarow.bind("mousedown", $.proxy(this.activeTableRow, this));
        tabledatarow.bind("mouseover", $.proxy(this.tableRowHover, this));
        var keys = Object.keys(data);
        for (var index = 0; index < keys.length; index++) {
            this.insertTableData(tabledatarow, data[keys[index]]);
        }
    };
    AutoCompleteHelper.prototype.activeTableRow = function (args) {
        var target = $(args.currentTarget);
        $("#table_body_div").find('tr').removeClass('e-rowselected');
        target.addClass('e-rowselected');
    };
    AutoCompleteHelper.prototype.tableRowHover = function (args) {
        var target = $(args.currentTarget);
        $("#table_body_div").find('tr').removeClass('e-rowhover');
        target.addClass('e-rowhover');
    };
    AutoCompleteHelper.prototype.renderTableData = function (response) {
        if (response && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                this.insertTableRow(this.tableElement, response[i]);
            }
        }
    };
    AutoCompleteHelper.prototype.ajaxFunction = function () {
        $.ajax({
            method: "GET",
            dataType: "json",
            url: "api/Books/Get",
            success: $.proxy(this.renderTableData, this),
            error: function (data) {
                alert(data);
            }
        });
    };
    AutoCompleteHelper.prototype.updateDataTable = function (response) {
        $("tr.data_row.e-rowselected td.table_data")[1].innerHTML = response.bookName;
        $("tr.data_row.e-rowselected td.table_data")[2].innerText = response.author;
        $("tr.data_row.e-rowselected td.table_data")[3].innerText = response.publishedYear;
        $("tr.data_row.e-rowselected td.table_data")[4].innerText = response.publishedBy;
    };
    AutoCompleteHelper.prototype.buildElement = function (tag, classes, id, innerHtml, styles, attributes) {
        var tagElement = document.createElement(tag);
        if (classes && classes.length > 0) {
            tagElement.className = classes;
        }
        if (id && id.length > 0) {
            tagElement.id = id;
        }
        if (innerHtml) {
            var txtNode = document.createTextNode(innerHtml);
            tagElement.appendChild(txtNode);
        }
        if (attributes) {
            var keys = Object.keys(attributes);
            for (var index = 0; index < keys.length; index++) {
                tagElement.setAttribute(keys[index], attributes[keys[index]]);
            }
        }
        if (styles) {
            var keys = Object.keys(styles);
            for (var index = 0; index < keys.length; index++) {
                tagElement.style[keys[index]] = styles[keys[index]];
            }
        }
        return $(tagElement);
    };
    return AutoCompleteHelper;
}());
var DialogHelper = /** @class */ (function (_super) {
    __extends(DialogHelper, _super);
    function DialogHelper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.deleteRootElement = null;
        _this.addEditRootElement = null;
        return _this;
    }
    DialogHelper.prototype.showEditAddDialog = function (inputData, isEdit) {
        var _this = this;
        if (isEdit) {
            this.renderDialog($("#containers"), isEdit);
            this.addEditRootElement.draggable();
            $(".heading_button").prop("disabled", true);
            this.addEditRootElement.find("input#form_bookID").val(inputData.BookID);
            this.addEditRootElement.find("input#form_bookName").val(inputData.BookName);
            this.addEditRootElement.find("input#form_author").val(inputData.Author);
            this.addEditRootElement.find("input#form_publishedYear").val(inputData.PublishedYear);
            this.addEditRootElement.find("input#form_publishedBy").val(inputData.PublishedBy);
            $("#editbutton").click(function () {
                _this.editAjax();
                _this.addEditRootElement.remove();
                $(".heading_button").prop("disabled", false);
            });
        }
        else {
            this.renderDialog($("#containers"), isEdit);
            this.addEditRootElement.draggable();
            $(".heading_button").prop("disabled", true);
            $("#savebutton").click(function () {
                if (_this.isValidBookID()) {
                    return null;
                }
                else {
                    _this.addAjax();
                    _this.addEditRootElement.remove();
                    $(".heading_button").prop("disabled", false);
                }
            });
        }
        $("#cancelbutton").click(function () {
            _this.addEditRootElement.remove();
            $(".heading_button").prop("disabled", false);
        });
    };
    DialogHelper.prototype.renderDialog = function (target, isEdit) {
        var dialog = this.addEditRootElement = this.buildElement("dialog", "add_edit_dialog", "dialog_box", null, { "font-family": "Calibri" }, null);
        target.append(dialog);
        var headingTag = this.buildElement("h3", null, "dialog_header", "".concat(((isEdit) ? "Edit the record" : "Add the record")), null, null);
        dialog.append(headingTag);
        var horizontalLine = this.buildElement("hr", null, null, null, null, null);
        dialog.append(horizontalLine);
        var formTag = this.buildElement("form", "input_elements", "_formTag", null, null, null);
        dialog.append(formTag);
        this.insertInputField(formTag, isEdit);
    };
    DialogHelper.prototype.insertInputField = function (target, isEdit) {
        this.bookIDTextBox(target, isEdit);
        var bookNameLabelTag = this.buildElement("label", null, null, "Book Name", null, null);
        target.append(bookNameLabelTag);
        var bookNameTextBox = this.buildElement("input", "input_field", "form_bookName", "", {}, { "type": "text" });
        target.append(bookNameTextBox);
        var authorLabelTag = this.buildElement("label", null, null, "Author Name", null, null);
        target.append(authorLabelTag);
        var authorTextBox = this.buildElement("input", "input_field", "form_author", "", {}, { "type": "text" });
        target.append(authorTextBox);
        var publishedYearLabelTag = this.buildElement("label", null, null, "Published Year", null, null);
        target.append(publishedYearLabelTag);
        var publishedYearTextBox = this.buildElement("input", "input_field", "form_publishedYear", "", {}, { "type": "text", "placeholder": "YYYY" });
        target.append(publishedYearTextBox);
        var publishedByLabelTag = this.buildElement("label", null, null, "Published By", null, null);
        target.append(publishedByLabelTag);
        var publishedByTextBox = this.buildElement("input", "input_field", "form_publishedBy", "", {}, { "type": "text" });
        target.append(publishedByTextBox);
        var horizontalLine = this.buildElement("hr", null, null, null, null, null);
        target.append(horizontalLine);
        this.renderDialogButton(target, isEdit);
    };
    DialogHelper.prototype.renderDeleteDialog = function (target, data) {
        var dialog = this.deleteRootElement = this.buildElement("dialog", "deletecontainer", "delete_dialog", null, null, null);
        target.append(dialog);
        var headingTag = this.buildElement("h3", null, "heading_delete", "Delete the record", {}, null);
        dialog.append(headingTag);
        var line = this.buildElement("hr", null, null, null, null, null);
        dialog.append(line);
        var content = this.buildElement("p", null, "content_delete", "You have selected the ".concat(data, " to delete from the table. Are you sure you want to delete this BookID ? "), {}, null);
        dialog.append(content);
        var _line = this.buildElement("hr", null, null, null, null, null);
        dialog.append(_line);
        var yesButton = this.buildElement("input", "delete_yes_button", "yes_button", null, {}, { "type": "button", "value": "Yes" });
        dialog.append(yesButton);
        var cancelButton = this.buildElement("input", "delete_no_button", "cancel_delete_button", null, {}, { "type": "button", "value": "No" });
        dialog.append(cancelButton);
    };
    DialogHelper.prototype.renderDialogButton = function (target, isEdit) {
        var check = (isEdit) ? "Edit" : "Add";
        var id = (isEdit) ? "editbutton" : "savebutton";
        var editButton = this.buildElement("input", "dialogButtons", "".concat(id), null, {}, { "type": "button", "value": "".concat(check) });
        target.append(editButton);
        var cancelButton = this.buildElement("input", "cancel_dialog_button", "cancelbutton", null, {}, { "type": "button", "value": "Cancel" });
        target.append(cancelButton);
    };
    DialogHelper.prototype.bookIDTextBox = function (target, isEdit) {
        if (isEdit) {
            var editBookIDLabelTag = this.buildElement("label", null, null, "BookID", null, null);
            target.append(editBookIDLabelTag);
            var editBookIDTextBox = this.buildElement("input", "edit_bookID_input_field", "form_bookID", null, { "background-color": "lightgrey", "border-color": "black" }, { "type": "text", "disabled": "true" });
            target.append(editBookIDTextBox);
        }
        else {
            var addBookIDLabelTag = this.buildElement("label", null, null, "BookID", null, null);
            target.append(addBookIDLabelTag);
            var addBookIDTextBox = this.buildElement("input", "input_field", "form_bookID", null, {}, { "type": "text" });
            target.append(addBookIDTextBox);
        }
    };
    DialogHelper.prototype.addAjax = function () {
        var _this = this;
        var bookID = this.addEditRootElement.find("#form_bookID").val();
        var bookName = this.addEditRootElement.find("#form_bookName").val();
        var author = this.addEditRootElement.find("#form_author").val();
        var publishedYear = this.addEditRootElement.find("#form_publishedYear").val();
        var publishedBy = this.addEditRootElement.find("#form_publishedBy").val();
        var send = {
            BookID: bookID,
            BookName: bookName,
            Author: author,
            PublishedYear: publishedYear,
            PublishedBy: publishedBy
        };
        $.ajax({
            type: "POST",
            url: "api/Books/Post",
            contentType: "application/json",
            data: JSON.stringify(send),
            success: function (data) {
                _this.insertTableRow($("#table_body_div"), data);
            },
            error: function (data) {
                alert(data);
            }
        });
    };
    DialogHelper.prototype.editAjax = function () {
        var _this = this;
        var bookID = this.addEditRootElement.find("#form_bookID").val();
        var bookName = this.addEditRootElement.find("#form_bookName").val();
        var author = this.addEditRootElement.find("#form_author").val();
        var publishedYear = this.addEditRootElement.find("#form_publishedYear").val();
        var publishedBy = this.addEditRootElement.find("#form_publishedBy").val();
        var send = {
            BookName: bookName,
            Author: author,
            PublishedYear: publishedYear,
            PublishedBy: publishedBy
        };
        $.ajax({
            type: "PUT",
            url: "api/Books/Put/" + "".concat(bookID),
            contentType: "application/json",
            data: JSON.stringify(send),
            success: function (data) {
                _this.updateDataTable(data);
            },
            error: function (data) {
                alert(data);
            }
        });
    };
    DialogHelper.prototype.deleteData = function () {
        var _this = this;
        var bookID = $("tr.data_row.e-rowselected td.table_data")[0].innerText;
        this.renderDeleteDialog($("#containers"), bookID);
        $(".heading_button").prop("disabled", true);
        $("#cancel_delete_button").click(function () {
            _this.deleteRootElement.remove();
            $(".heading_button").prop("disabled", false);
        });
        $("#yes_button").click(function () {
            _this.deleteAjax(bookID);
            _this.deleteRootElement.remove();
            $(".heading_button").prop("disabled", false);
        });
    };
    DialogHelper.prototype.deleteAjax = function (data) {
        var send = {
            BookID: data
        };
        $.ajax({
            type: "DELETE",
            url: "api/Books/Delete/" + "".concat(data),
            contentType: "application/json",
            data: JSON.stringify(send),
            success: function () {
                $("tr.data_row.e-rowselected").remove();
            },
            error: function () {
                alert("Sorry! Data not deleted");
            }
        });
    };
    DialogHelper.prototype.isValidBookID = function () {
        var bookID = this.addEditRootElement.find("#input_bookid").val();
        var tableData = $("tr.data_row td:first-child");
        for (var i = 0; i < tableData.length; i++) {
            var id = tableData[i].innerHTML;
            if (bookID == id) {
                alert("This BookID alredy existed Please enter another bookID");
                return true;
            }
        }
    };
    return DialogHelper;
}(AutoCompleteHelper));
//# sourceMappingURL=bookdetailsrendering.js.map