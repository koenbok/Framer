import os
import pipes
import subprocess
import logging

def run(command):
    
    logger = logging.getLogger(__name__)
    
    logger.debug(command)
    
    # logger.info(os.environ['PATH'])

    process = subprocess.Popen([command], 
        shell=True, 
        stdin=subprocess.PIPE, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE)
    
    stdout = process.stdout.readline()
    stderr = process.stderr.readline()
    
    if stdout: logger.info(stdout)
    if stderr: logger.warning(stderr)

EXTRA_CONTEXT = {}

def preBuild(site):

    global EXTRA_CONTEXT

    run('find %s -name "*.scss" -not -name "_*" -exec scss -C --update {} \;' % pipes.quote(site.static_path))
    run('find %s -name "*.sass" -not -name "_*" -exec scss -C --update {} \;' % pipes.quote(site.static_path))
    run('find %s -name "*.coffee" -exec coffee -c {} \;' % pipes.quote(site.static_path))

    EXTRA_CONTEXT["testScripts"] = []

    for fileName in os.listdir(os.path.join(site.static_path, "tests")):
        if fileName.endswith(".coffee"):
            EXTRA_CONTEXT["testScripts"].append(fileName)

def preBuildPage(site, context, data):
    context.update(EXTRA_CONTEXT)
    return context, data

