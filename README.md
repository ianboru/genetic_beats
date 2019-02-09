Genetic Beats
=============

Setup
-----

This setup assumes you have

* A copy of the repo - https://github.com/ianboru/genetic_beats
* A recent version of node & npm (node 8+, install through homebrew if you don't)
* homebrew - https://brew.sh


Make sure to install

* Ansible - `brew install ansible`
* Vagrant - https://www.vagrantup.com/downloads.html
* Virtualbox - https://www.virtualbox.org/wiki/Downloads


Run everything here *outside* of the vagrant box unless otherwise specified:

    vagrant up   # Start VM
    vagrant halt # Sleep VM
    vagrant destroy -f # Destroy VM

    vagrant ssh  # SSH into VM
    runserver    # Run Django server (run from inside vagrant box)

    # Separate terminal window
    npm start    # Run webpack


Icon Set
--------

* https://react-icons.netlify.com/#/icons/md
