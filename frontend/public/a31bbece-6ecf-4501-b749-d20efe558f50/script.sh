#!/bin/bash 

TEXT=$1 
NUMBER=$2 

# report size of the uploaded file (in this directory) to a report file 
UPLOAD_FILE_REPORT=$(du -b *) 
echo $UPLOAD_FILE_REPORT > the_file_report.txt 

# do (fake) work, reporting progress to the stderr 
for i in $(seq 1 $NUMBER); 
  do 
  >&2 echo "Processing... $i/$NUMBER" 
  sleep 1 
done 

# fails 10% of the time
if [ $((1 + $RANDOM % 10)) -eq 10 ]; then 
then 
  >&2 echo "PROCESSING FAILURE ENCOUNTERED!" 
  exit 1 
fi 

# print the length of the text (whitespace may have been trimmed) to the stdout 
echo $TEXT | wc -c