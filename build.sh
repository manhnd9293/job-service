docker rmi job-service
docker build -t job-service .
docker tag job-service manhndtest/job-service
docker push manhndtest/job-service
