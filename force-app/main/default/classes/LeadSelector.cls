public with sharing class LeadSelector {
    public static List<Lead> getAllLeads(String searchKey, String sortBy, String sortDirection) {
       String query = 'Select Id,Name,FirstName,LastName,LeadSource,Company,Phone,Email,CreatedDate from Lead ';
       system.debug('query---'+query);
       if ( searchKey != null && searchKey != '' ) {
           String key = '%' + searchKey + '%';
           query += ' WHERE Name LIKE :key';
       }
       if ( sortBy != null && sortDirection != null ) {
           query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
       }
       return Database.query( query );
    }
}