#!/bin/bash

cygwin=false
case "`uname`" in
  CYGWIN*) cygwin=true;;
esac

COMMAND=$1
shift

MYSQL_SERVER="127.0.0.1"
ROOT_USER="root"
ROOT_USER_PASSWORD="root"

function ping() {
  mysqladmin --host=$MYSQL_SERVER --port=3306 -u $ROOT_USER --password=$ROOT_USER_PASSWORD ping
}

function shutdown() {
  mysqladmin --host=$MYSQL_SERVER --port=3306 -u $ROOT_USER --password=$ROOT_USER_PASSWORD shutdown
}

function createdb() {
  dbname=$1 
  #mysqladmin --host=$MYSQL_SERVER --port=3306 --user=$ROOT_USER --password=$ROOT_USER_PASSWORD create $dbname 
   mysql --host=$MYSQL_SERVER -u $ROOT_USER --password=$ROOT_USER_PASSWORD <<< "create database $dbname DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci"
}

function newdb() {
  dbname=$1 
  mysql --host=$MYSQL_SERVER -u $ROOT_USER --password=$ROOT_USER_PASSWORD <<< "drop   database if exists $dbname"
  mysql --host=$MYSQL_SERVER -u $ROOT_USER --password=$ROOT_USER_PASSWORD <<< "create database $dbname DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci"
}

function dropdb() {
  dbname=$1 
  mysqladmin --host=$MYSQL_SERVER --port=3306 --user=$ROOT_USER --password=$ROOT_USER_PASSWORD drop $dbname
}

function createUser() {
  user=$1
  password=$2
  mysql --host=$MYSQL_SERVER -u $ROOT_USER --password=$ROOT_USER_PASSWORD <<< "GRANT ALL PRIVILEGES ON *.* TO $user@localhost IDENTIFIED BY '$password' WITH GRANT OPTION"
  mysql --host=$MYSQL_SERVER -u $ROOT_USER --password=$ROOT_USER_PASSWORD <<< "GRANT ALL PRIVILEGES ON *.* TO $user@'%' IDENTIFIED BY '$password' WITH GRANT OPTION"
}


if [ "$COMMAND" = "createdb" ] ; then
  createdb $1
elif [ "$COMMAND" = "newdb" ] ; then
  newdb $1
elif [ "$COMMAND" = "dropdb" ] ; then
  dropdb $1
elif [ "$COMMAND" = "createUser" ] ; then
  createUser $1  $2
elif [ "$COMMAND" = "hktclean" ] ; then
  newdb   "kpidb"
  createUser "kpi"  "kpi"
elif [ "$COMMAND" = "ping" ] ; then
  ping
elif [ "$COMMAND" = "shutdown" ] ; then
  shutdown
else
  echo "To check the mysql server:"
  echo "  mysql.sh ping"
  echo "  mysql.sh shutdown"
  echo "  mysql.sh createdb dbname"
  echo "  mysql.sh dropdb   dbname"
  echo "  mysql.sh createUser   username password"
  echo "  mysql.sh hktclean"
fi
