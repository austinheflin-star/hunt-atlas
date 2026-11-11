a=open('app.html').read(); d=open('data.js').read()
assert a.count('/*DATA*/')==1
assert a.count('/*AI*/')==1
o=a.replace('/*DATA*/',d).replace('/*AI*/',open('ai.js').read())
for p in ('site/index.html','v13.html'): open(p,'w').write(o)
s=o[o.rfind('<script>')+8:o.rfind('</script>')]; open('/tmp/claude-0/-home-claude/9b729957-bff7-5048-939c-b62d8fe72de5/scratchpad/chk.js','w').write(s)
print(len(o))
