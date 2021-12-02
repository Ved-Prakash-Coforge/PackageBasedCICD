import { LightningElement,wire,api,track} from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';
import deleteRecords from '@salesforce/apex/LeadController.deleteRecords';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//Columns to show in grid
const columns = [
    {   label:'Name',fieldName:'LeadURL',type:'url',
        typeAttributes: {
            label: { 
                fieldName: 'Name' 
            },
            target : '_blank'
        }
    },
    { label: 'First Name', fieldName: 'FirstName', editable: true ,sortable: true},
    { label: 'Last Name', fieldName: 'LastName', editable: true ,sortable: true},
    { label: 'Company', fieldName: 'Company' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];

export default class SearchAndShowRecord extends LightningElement {
    //Variables
    @track columns = columns;
   
    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'FirstName';
    @api searchKey = '';
    result;
    refreshApex;

    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 20; 
    @track totalRecountCount = 0;
    @track totalPage = 0;

    //called get all leads method to fill grid
    @wire(getLeads,{searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'}) 
    wiredLeads(result) {
        this.refreshApex = result;
        if (result.data) {
            this.items = result.data;
            this.totalRecountCount = result.data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
    
    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.refreshApex);
        
    }
  
    handleKeyChange( event ) {
        this.searchKey = event.target.value;
        //this.data = this.data.filter(rec => JSON.stringify(rec).includes(this.searchKey));
        return refreshApex(this.refreshApex);
    }

    @api selectedContactIdList=[];
    @track errorMsg;
    //this method is used to get selected records
    getSelectedRows(event){
        const selectedContactRows = event.detail.selectedRows;
        window.console.log('selectedContactRows# ' + JSON.stringify(selectedContactRows));
        this.selectedContactIdList=[];
        selectedContactRows.forEach(rec => {
            this.selectedContactIdList.push(rec.Id);
        });
    }

    //this method is used to delete records
    deletedSelectedRecords(event){
        console.log('selectedContactIdList::'+this.selectedContactIdList);
        deleteRecords({recordIds: this.selectedContactIdList})
        .then(()=>{
            this.template.querySelector('lightning-datatable').selectedContactRows=[];
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record deleted successfully',
                variant:'success'
              });
            this.dispatchEvent(toastEvent);
            return refreshApex(this.refreshApex);
        })
        .catch(error =>{
            this.errorMsg =error;
            window.console.log('unable to delete the record due to ' + JSON.stringify(this.errorMsg));
            const toastEvent = new ShowToastEvent({
                title:'Error!',
                message:'Not able to delete record.',
                variant:'error'
              });
            this.dispatchEvent(toastEvent);
        });
    }
}