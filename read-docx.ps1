Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-Docx {
    param($Path)
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    $entry = $zip.GetEntry('word/document.xml')
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xmlString = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()
    
    $xml = [xml]$xmlString
    $nsm = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $nsm.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
    
    $textNodes = $xml.SelectNodes("//w:t", $nsm)
    $text = ($textNodes | ForEach-Object { $_.InnerText }) -join "`n"
    return $text
}

Write-Output "--- CRYO_Short_Professional_Website_Brief.docx ---"
Read-Docx "d:\cryo\resources\CRYO_Short_Professional_Website_Brief.docx"

Write-Output "`n--- CRYO_Coolant_Product_Document (1).docx ---"
Read-Docx "d:\cryo\resources\CRYO_Coolant_Product_Document (1).docx"
