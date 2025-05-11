from docx import Document

def parse_sae_tables(docx_path):
    doc = Document(docx_path)
    extracted_tables = []
    for i, para in enumerate(doc.paragraphs):
        if "Summary of Serious Adverse Events" in para.text:
            for table in doc.tables:
                headers = [cell.text.strip() for cell in table.rows[0].cells]
                if set(["Preferred Term", "Placebo", "Compound X"]).issubset(set(headers)):
                    data = []
                    for row in table.rows[1:]:
                        row_data = {headers[i]: cell.text.strip() for i, cell in enumerate(row.cells)}
                        data.append(row_data)
                    total_row = next((r for r in data if "total" in r[headers[0]].lower()), None)
                    extracted_tables.append({
                        "title": para.text.strip(),
                        "columns": headers,
                        "rows": data,
                        "total_participants_row": total_row
                    })
                    break
    return extracted_tables
