ECHO 
C:\HKTSoft4.0\Database\mysql\bin\mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS kpidb";
C:\HKTSoft4.0\Database\mysql\bin\mysql -u root -proot -e "CREATE USER 'kpi'@'localhost' IDENTIFIED BY 'kpi'";
C:\HKTSoft4.0\Database\mysql\bin\mysql -u root -proot -e "GRANT ALL ON kpidb.* TO 'kpi'@'localhost'";