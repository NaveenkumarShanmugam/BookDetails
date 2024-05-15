class AutoCompleteHelper {
    public tableElement: JQuery = null;
    public dialogInstance: DialogHelper = null; 
  
    public initializeLayout():void {
        this.dialogInstance = new DialogHelper();
        this.renderContainer($("#containers"));
        this.ajaxFunction();
        this.wireEvents();
    }

    private editData(): void {         
        let bookID: any = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[0].innerHTML;
        let bookName: any = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[1].innerHTML;
        let author: any = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[2].innerHTML;
        let publishedYear: any = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[3].innerHTML;
        let publishedBy: any = this.tableElement.find("tr.data_row.e-rowselected td.table_data")[4].innerHTML;
        let data: any = {
            BookID: bookID,BookName: bookName,Author: author,PublishedYear: publishedYear,PublishedBy:publishedBy
        }
        this.dialogInstance.showEditAddDialog(data, true);
    }

    private addData(): void {
        this.dialogInstance.showEditAddDialog(null, false);
    }

    private wireEvents() :void{
        $("#delete_btn").bind('click', $.proxy(this.dialogInstance.deleteData,this.dialogInstance));
        $("#edit_btn").bind('click', $.proxy(this.editData, this));
        $("#add_btn").bind('click', $.proxy(this.addData, this));
    }

    private renderContainer(target: JQuery): void {
        let div: JQuery = this.buildElement("div", "container", "containner1", null, {} , null);
        target.append(div);
        this.renderTable(div);
    }

    private renderTable(target: JQuery): void {
        let table: JQuery = this.buildElement("table", null, "table_tag", null, {} , {});
        target.append(table);
        let divHeader: JQuery = this.buildElement("div", "table_header", "table_header_div", null, {}, {});
        table.append(divHeader);
        let divBody: JQuery = this.tableElement=this.buildElement("div", "table_body", "table_body_div", null, {}, {});
        table.append(divBody);  
        this.renderTableHeader(divHeader);
    }

    private renderTableHeader(target: JQuery): void {
        let tableRow: JQuery = this.buildElement("tr", "table_heading_buttons", "table_row_tag", null, { }, null);
        target.append(tableRow);
        let headingRow: JQuery = this.buildElement("tr", "table_title", "table_row_heading_tag", null, {}, null);
        target.append(headingRow);
        this.renderLayoutHeader(tableRow);
        this.tableHeader(headingRow);
    }

    private renderLayoutHeader(target: JQuery): void {
        let tableHeading: JQuery = this.buildElement("th", null, "table_heading_tag", null, { }, null);
        target.append(tableHeading);
        let addButton: JQuery = this.buildElement("input", "heading_button", "add_btn", null, {  }, { 'type': 'button', 'value': 'Add' });
        let editButton: JQuery = this.buildElement("input", "heading_button", "edit_btn", null, { }, { 'type': 'button', 'value': 'Edit' });
        let deleteButton: JQuery = this.buildElement("input", "heading_button", "delete_btn", null, {  }, { 'type': 'button', 'value': 'Delete'});
        tableHeading.append(addButton);
        tableHeading.append(editButton);
        tableHeading.append(deleteButton);
    }

    private tableHeader(target: JQuery): void {
        let bookID: JQuery = this.buildElement("th", "table_heading", "bookID", "BOOK_ID", { }, null);
        target.append(bookID);
        let bookName: JQuery = this.buildElement("th", "table_heading", "bookName", "BOOK NAME", {  }, null);
        target.append(bookName);
        let author: JQuery = this.buildElement("th", "table_heading", "author", "AUTHOR", {  }, null);
        target.append(author);
        let publishedYear: JQuery = this.buildElement("th", "table_heading", "publishedYear", "PUBLISHED YEAR", { }, null);
        target.append(publishedYear);
        let publishedBy: JQuery = this.buildElement("th", "table_heading", "publishedBy", "PUBLISHED BY", { }, null);
        target.append(publishedBy);
    }

    private insertTableData(target: JQuery, data: any):void
    {
        let getBookID: JQuery = this.buildElement("td", "table_data", null, `${data}`, {  }, null);
        target.append(getBookID); 
    }

    public insertTableRow(target:JQuery,data: any):void
    { 
        let tabledatarow: JQuery = this.buildElement("tr", "data_row", null, null, {},null);
        target.append(tabledatarow);   
        tabledatarow.bind("mousedown", $.proxy(this.activeTableRow, this));
        tabledatarow.bind("mouseover", $.proxy(this.tableRowHover, this));      
        let keys: string[] = Object.keys(data);
        for (let index: number = 0; index < keys.length; index++) {
            this.insertTableData(tabledatarow, data[keys[index]]);
        }
    }

    private activeTableRow(args): void {
        let target: JQuery = $(args.currentTarget);
        $("#table_body_div").find('tr').removeClass('e-rowselected');
        target.addClass('e-rowselected');
    }

    private tableRowHover(args): void {
        let target: JQuery = $(args.currentTarget);
        $("#table_body_div").find('tr').removeClass('e-rowhover');
        target.addClass('e-rowhover');
    }

    private renderTableData(response: any[]):void
    {
        if (response && response.length > 0) {
            for (let i: number = 0; i < response.length; i++) {
                this.insertTableRow(this.tableElement,response[i]);
            }
        }
    }

    private ajaxFunction():void
    {    
        $.ajax({
            method: "GET",
            dataType: "json",
            url: "api/Books/Get",
            success: $.proxy(this.renderTableData, this),
            error: (data)=>{
                alert(data);
            }
        });
    }

    public updateDataTable(response: any): void {
        $("tr.data_row.e-rowselected td.table_data")[1].innerHTML = response.bookName;
        $("tr.data_row.e-rowselected td.table_data")[2].innerText = response.author;
        $("tr.data_row.e-rowselected td.table_data")[3].innerText = response.publishedYear;
        $("tr.data_row.e-rowselected td.table_data")[4].innerText = response.publishedBy;
    }

    public buildElement(tag: string, classes: string, id: string, innerHtml: string, styles: object, attributes: object): JQuery {
        let tagElement: HTMLElement = document.createElement(tag);
        if (classes && classes.length > 0) {
            tagElement.className = classes;
        }
        if (id && id.length > 0) {
            tagElement.id = id;
        } if (innerHtml) {
            let txtNode: Text = document.createTextNode(innerHtml);
            tagElement.appendChild(txtNode);
        } if (attributes) {
            let keys: string[] = Object.keys(attributes);
            for (let index: number = 0; index < keys.length; index++) {
                tagElement.setAttribute(keys[index], attributes[keys[index]]);
            }
        } if (styles) {
            let keys: string[] = Object.keys(styles);
            for (let index: number = 0; index < keys.length; index++) {
                tagElement.style[keys[index]] = styles[keys[index]];
            }
        }
        return $(tagElement);
    }
}

class DialogHelper extends AutoCompleteHelper {
    private deleteRootElement: JQuery = null;
    private addEditRootElement: any = null;

    public showEditAddDialog(inputData: any, isEdit: boolean): void {

        if (isEdit) {
            this.renderDialog($("#containers"), isEdit);
            this.addEditRootElement.draggable();
            $(".heading_button").prop("disabled", true);
            this.addEditRootElement.find("input#form_bookID").val(inputData.BookID);
            this.addEditRootElement.find("input#form_bookName").val(inputData.BookName);
            this.addEditRootElement.find("input#form_author").val(inputData.Author);
            this.addEditRootElement.find("input#form_publishedYear").val(inputData.PublishedYear);
            this.addEditRootElement.find("input#form_publishedBy").val(inputData.PublishedBy);
            $("#editbutton").click(() => {
                this.editAjax();
                this.addEditRootElement.remove();
                $(".heading_button").prop("disabled", false);
            });

        } else {
            this.renderDialog($("#containers"), isEdit);
            this.addEditRootElement.draggable();
            $(".heading_button").prop("disabled", true);
            $("#savebutton").click(() => {
                if (this.isValidBookID()) {
                    return null;
                }
                else {
                    this.addAjax();
                    this.addEditRootElement.remove();
                    $(".heading_button").prop("disabled", false);
                }
            });
        }
        $("#cancelbutton").click(() => {
            this.addEditRootElement.remove();
            $(".heading_button").prop("disabled", false);
        });

    }

    private renderDialog(target: JQuery, isEdit: boolean): void {
        let dialog: any = this.addEditRootElement = this.buildElement("dialog", "add_edit_dialog", "dialog_box", null, { "font-family": "Calibri" }, null);
        target.append(dialog);
        let headingTag: JQuery = this.buildElement("h3", null, "dialog_header", `${((isEdit) ? "Edit the record" : "Add the record")}`, null, null);
        dialog.append(headingTag);
        let horizontalLine: JQuery = this.buildElement("hr", null, null, null, null, null);
        dialog.append(horizontalLine);
        let formTag: JQuery = this.buildElement("form", "input_elements", "_formTag", null, null, null);
        dialog.append(formTag);
        this.insertInputField(formTag, isEdit);
    }

    private insertInputField(target: JQuery, isEdit: boolean): void {
        this.bookIDTextBox(target, isEdit);
        let bookNameLabelTag: JQuery = this.buildElement("label", null, null, "Book Name", null, null);
        target.append(bookNameLabelTag);
        let bookNameTextBox: JQuery = this.buildElement("input", "input_field", "form_bookName", "", {}, { "type": "text" });
        target.append(bookNameTextBox);
        let authorLabelTag: JQuery = this.buildElement("label", null, null, "Author Name", null, null);
        target.append(authorLabelTag);
        let authorTextBox: JQuery = this.buildElement("input", "input_field", "form_author", "", {}, { "type": "text" });
        target.append(authorTextBox);
        let publishedYearLabelTag: JQuery = this.buildElement("label", null, null, "Published Year", null, null);
        target.append(publishedYearLabelTag);
        let publishedYearTextBox: JQuery = this.buildElement("input", "input_field", "form_publishedYear", "", {}, { "type": "text", "placeholder": "YYYY" });
        target.append(publishedYearTextBox);
        let publishedByLabelTag: JQuery = this.buildElement("label", null, null, "Published By", null, null);
        target.append(publishedByLabelTag);
        let publishedByTextBox: JQuery = this.buildElement("input", "input_field", "form_publishedBy", "", {}, { "type": "text" });
        target.append(publishedByTextBox);
        let horizontalLine: JQuery = this.buildElement("hr", null, null, null, null, null);
        target.append(horizontalLine);
        this.renderDialogButton(target, isEdit);
    }

    private renderDeleteDialog(target: JQuery, data: any): void {
        let dialog: JQuery = this.deleteRootElement = this.buildElement("dialog", "deletecontainer", "delete_dialog", null, null, null);
        target.append(dialog);
        let headingTag: JQuery = this.buildElement("h3", null, "heading_delete", "Delete the record", {}, null);
        dialog.append(headingTag);
        let line: JQuery = this.buildElement("hr", null, null, null, null, null);
        dialog.append(line);
        let content: JQuery = this.buildElement("p", null, "content_delete", `You have selected the ${data} to delete from the table. Are you sure you want to delete this BookID ? `, {}, null);
        dialog.append(content);
        let _line: JQuery = this.buildElement("hr", null, null, null, null, null);
        dialog.append(_line);
        let yesButton: JQuery = this.buildElement("input", "delete_yes_button", "yes_button", null, {}, { "type": "button", "value": "Yes" });
        dialog.append(yesButton);
        let cancelButton: JQuery = this.buildElement("input", "delete_no_button", "cancel_delete_button", null, {}, { "type": "button", "value": "No" });
        dialog.append(cancelButton);
    }

    private renderDialogButton(target: JQuery, isEdit: boolean): void {
        let check: any = (isEdit) ? "Edit" : "Add";
        let id: any = (isEdit) ? "editbutton" : "savebutton";
        let editButton: JQuery = this.buildElement("input", "dialogButtons", `${id}`, null, {}, { "type": "button", "value": `${check}` });
        target.append(editButton);
        let cancelButton: JQuery = this.buildElement("input", "cancel_dialog_button", "cancelbutton", null, {}, { "type": "button", "value": "Cancel" });
        target.append(cancelButton);
    }

    private bookIDTextBox(target: JQuery, isEdit: boolean): void{
        if (isEdit) {
            let editBookIDLabelTag: JQuery = this.buildElement("label", null, null, "BookID", null, null);
            target.append(editBookIDLabelTag);
            let editBookIDTextBox: JQuery = this.buildElement("input", "edit_bookID_input_field", "form_bookID", null, {"background-color":"lightgrey","border-color":"black"}, { "type": "text","disabled":"true"});
            target.append(editBookIDTextBox);
        }
        else {
            let addBookIDLabelTag: JQuery = this.buildElement("label", null, null, "BookID", null, null);
            target.append(addBookIDLabelTag);
            let addBookIDTextBox: JQuery = this.buildElement("input", "input_field", "form_bookID", null, {}, { "type": "text"});
            target.append(addBookIDTextBox);  
        }
             
    }

    private addAjax(): void {
        let bookID: any = this.addEditRootElement.find("#form_bookID").val();
        let bookName: any = this.addEditRootElement.find("#form_bookName").val();
        let author: any = this.addEditRootElement.find("#form_author").val();
        let publishedYear: any = this.addEditRootElement.find("#form_publishedYear").val();
        let publishedBy: any = this.addEditRootElement.find("#form_publishedBy").val();
        let send: any = {
            BookID: bookID,
            BookName: bookName,
            Author: author,
            PublishedYear: publishedYear,
            PublishedBy: publishedBy
        }

        $.ajax({
            type: "POST",
            url: "api/Books/Post",
            contentType: "application/json",
            data: JSON.stringify(send),
            success: (data) => {
                this.insertTableRow($("#table_body_div"),data);
             },
            error: (data)=> {
                alert(data);
            }
        });     
    }

    private editAjax(): void {
        let bookID: any = this.addEditRootElement.find("#form_bookID").val();
        let bookName: any = this.addEditRootElement.find("#form_bookName").val();
        let author: any = this.addEditRootElement.find("#form_author").val();
        let publishedYear: any = this.addEditRootElement.find("#form_publishedYear").val();
        let publishedBy: any = this.addEditRootElement.find("#form_publishedBy").val();
        let send: any = {
            BookName: bookName,
            Author: author,
            PublishedYear: publishedYear,
            PublishedBy: publishedBy
        }
        $.ajax({
            type: "PUT",
            url: "api/Books/Put/" + `${bookID}`,
            contentType: "application/json",
            data: JSON.stringify(send),
            success: (data) => {
                this.updateDataTable(data);
            },
            error:(data)=> {
                alert(data);
            }
        });
    }

    public deleteData(): void {  
        let bookID: any = $("tr.data_row.e-rowselected td.table_data")[0].innerText;
        this.renderDeleteDialog($("#containers"), bookID);
        $(".heading_button").prop("disabled", true);
        $("#cancel_delete_button").click(() => {
            this.deleteRootElement.remove();
            $(".heading_button").prop("disabled", false);
        });
        $("#yes_button").click(() => {
            this.deleteAjax(bookID);
            this.deleteRootElement.remove();
            $(".heading_button").prop("disabled", false);
        });
    }
   
    private deleteAjax(data:any): void {
        let send: any = {
           BookID:data
        }
        $.ajax({
            type: "DELETE",
            url: "api/Books/Delete/" + `${data}`,
            contentType: "application/json",
            data: JSON.stringify(send),
            success: () => {              
                    $("tr.data_row.e-rowselected").remove();              
            },
            error: function () {
                alert("Sorry! Data not deleted");
            }
        });
    }

    private isValidBookID(): boolean {
        let bookID: any = this.addEditRootElement.find("#input_bookid").val();
        let tableData: any = $("tr.data_row td:first-child");       
        for (let i: number = 0; i < tableData.length; i++) {
            let id: any = tableData[i].innerHTML;
            if (bookID == id) {
                alert("This BookID alredy existed Please enter another bookID");
                return true;
            }          
        }
    } 
}



