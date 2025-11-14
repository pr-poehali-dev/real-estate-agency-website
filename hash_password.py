#!/usr/bin/env python3
import bcrypt

# Password to hash
password = "ADmin@99!1"

# Generate salt and hash the password
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

# Print the hash as a string
print(hashed.decode('utf-8'))
