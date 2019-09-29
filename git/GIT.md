## GIT CLONE REPOSITORY

```bash
$ cd ~
$ git clone `pbpaste`
```

## PULL CODE FROM GITLAB

```
cd ~
for dir in $(ls -d */)
do
  cd $dir
  echo "into $dir"
  if [ -d ".git" ]; then
     git fetch
   fi
  cd ..
done
```
