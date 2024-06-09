import sys
import os
from pdf2docx import Converter

pdf_file = sys.argv[1]
base_name = os.path.splitext(pdf_file)[0]
docx_file = base_name + '.docx'
cv = Converter(pdf_file)
cv.convert(docx_file)
cv.close()
sys.stdout.write(docx_file)
