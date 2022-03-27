#!/usr/bin/expect
set url [lindex $argv 0]
set macPassword [lindex $argv 1]
set username [lindex $argv 2]
set password [lindex $argv 3]
set servercert [lindex $argv 4]
if { $servercert != ""} {
spawn sudo openconnect "$url" --servercert $servercert
} else {
spawn sudo openconnect "$url"
}
expect "Password" {send "$macPassword\r"}
expect "Enter 'yes' to accept" {send "yes\r"}
expect "Username:" {send "$username\r"}
expect "Password" {send "$password\r"}
interact
