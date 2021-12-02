public with sharing class LeadController {

    @AuraEnabled(cacheable=true)
    public static List<LeadWrapper> getLeads(String searchKey, String sortBy, String sortDirection){
        List<LeadWrapper> lstLeadWrapper = new List<LeadWrapper>();
        try {
            for (Lead lead : LeadSelector.getAllLeads(searchKey,sortBy,sortDirection)) {
                LeadWrapper leadWrapper = new LeadWrapper();
                leadWrapper.Id = lead.Id;
                leadWrapper.Name = lead.Name;
                leadWrapper.FirstName = lead.FirstName;
                leadWrapper.LastName = lead.LastName;
                leadWrapper.LeadSource = lead.LeadSource;
                leadWrapper.Company = lead.Company;
                leadWrapper.LeadURL = '/' + lead.Id;
                leadWrapper.Email = lead.Email;
                leadWrapper.Phone = lead.Phone;
                leadWrapper.createdDate = string.valueOf(lead.CreatedDate);
                lstLeadWrapper.add(leadWrapper);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return lstLeadWrapper;
    }

    private class LeadWrapper {
        @AuraEnabled
        public Id Id {get;set;}
        @AuraEnabled
        public String Name {get;set;}
        @AuraEnabled
        public String FirstName {get;set;}
        @AuraEnabled
        public String LastName {get;set;}
        @AuraEnabled
        public String LeadSource {get;set;}
        @AuraEnabled
        public String Company {get;set;}
        @AuraEnabled
        public String LeadURL {get;set;}
        @AuraEnabled
        public String Phone {get;set;}
        @AuraEnabled
        public String Email {get;set;}
        @AuraEnabled
        public String createdDate {get;set;}
    }

    @AuraEnabled
    public static List<LeadWrapper> deleteRecords(List<String> recordIds){
        string strMessage = '';
        try {
            List<Lead> lstLeadToDelete = new List<Lead>();
            for (String recordId : recordIds) {
                Lead lead = new Lead();
                lead.Id = recordId;
                lstLeadToDelete.add(lead);
            }
            if(!lstLeadToDelete.isEmpty()){
                Delete lstLeadToDelete;
                strMessage = 'Record deleted successfully!';
            }
            else {
                strMessage = 'No record found to delete.';
            }

        } catch (Exception e) {
            strMessage = e.getMessage();
            throw new AuraHandledException(e.getMessage());
        }
        return getLeads('', 'FirstName','asc');
    }
}