import PyPDF2


def bookmark_dict(bookmark_item, reader):
    result = []
    for item in bookmark_item:
        if isinstance(item, list):
            # recursive call
            result.extend(bookmark_dict(item, reader))
        else:
            page_num = reader.get_destination_page_number(item)
            page = reader.pages[page_num]
            text = page.extract_text()
            result.append({"title": item.title, "text": text, "page": page_num})
    return result

def extract_pdf_content(pdf_reader):
    content = ""
    for page_number in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_number]
        content += page.extract_text()

    return content


# reader = PyPDF2.PdfReader("your_pdf_file.pdf")
# # print(extract_pdf_content(reader))
# print(bookmark_dict("your_pdf_file.pdf"))