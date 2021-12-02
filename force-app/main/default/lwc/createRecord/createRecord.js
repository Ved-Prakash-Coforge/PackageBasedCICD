import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import FIRSTNAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Lead.LastName';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import LEADSOURCE_FIELD from '@salesforce/schema/Lead.LeadSource';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';

export default class CreateRecord extends LightningElement {
    leadId = '';
    firstName = '';
    lastName = '';
    company = '';
    leadSource = '';
    phone = '';
    email = '';
    result;

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }
    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }
    handleCompanyChange(event) {
        this.company = event.target.value;
    }
    handleLeadSourceChange(event) {
        this.leadSource = event.target.value;
    }
    handlePhoneChange(event) {
        this.phone = event.target.value;
    }
    handleEmailChange(event) {
        this.email = event.target.value;
    }

    createLead(){
        const fields = {};
        fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;
        fields[LASTNAME_FIELD.fieldApiName] = this.lastName;
        fields[COMPANY_FIELD.fieldApiName] = this.company;
        fields[LEADSOURCE_FIELD.fieldApiName] = this.leadSource;
        fields[PHONE_FIELD.fieldApiName] = this.phone;
        fields[EMAIL_FIELD.fieldApiName] = this.email;
        const recordInput = { apiName: LEAD_OBJECT.objectApiName, fields };

        createRecord(recordInput)
            .then(lead => {
                this.result = lead; 
                this.leadId = lead.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lead created successfully',
                        variant: 'success',
                    }),
                );
                this.template.querySelectorAll('lightning-input').forEach(each => {each.value = '';});
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}