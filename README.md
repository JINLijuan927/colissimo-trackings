# FTL OMS Tracking Batch Processing

## Jobs

### Start a simple job
NODE_ENV=test bin/jobs.js SimpleJob  

### Start a colissimo tracking job
NODE_ENV=test bin/jobs.js ColissimoTrackingJob  


## Implementation

### How to create a new model
Follow the examples in src/orm/models and reference to http://docs.sequelizejs.com/

### How to create a new job
Follow the examples in src/jobs to create a job and register it to app

### How to do translation
The translation files are stored in i18n, you can translate a text by calling i18n.__($text) 

