#!/usr/bin/env nush
(puts ((((((NSPasteboard generalPasteboard) pasteboardItems)
  map:    (do (pbi) (pbi stringForType: "public.file-url")))
  select: (do (url) (url)))
  map:    (do (url) ((NSURL URLWithString: url) path))) componentsJoinedByString: "\n"))