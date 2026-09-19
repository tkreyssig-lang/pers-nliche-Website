Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName System.Drawing

$base = Join-Path (Split-Path $PSScriptRoot -Parent) "assets\Technikfotos"

function Load-Image($path) {
    $uri = New-Object System.Uri($path)
    $bmp = New-Object System.Windows.Media.Imaging.BitmapImage
    $bmp.BeginInit()
    $bmp.UriSource = $uri
    $bmp.CacheOption = [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
    $bmp.EndInit()
    $bmp.Freeze()
    return $bmp
}

$tesla = Load-Image (Join-Path $base "tesla.webp")
$ford  = Load-Image (Join-Path $base "galaxy.webp")

# Jede Kachel wird komplett vom Auto ausgefuellt (wie "cover"): auf die
# Kachel-Hoehe skaliert (kein Zuschnitt oben/unten), ueberstehende Breite
# links/rechts gleichmaessig abgeschnitten. Beide Kacheln sind gleich gross,
# dadurch wirken beide Autos gleich gross, keine schwarzen Raender.
$tileW = 600
$tileH = 600

function Get-CoverRect($img, $offsetX) {
    $scale = $tileH / $img.PixelHeight
    $w = $img.PixelWidth * $scale
    $h = $tileH
    $x = $offsetX + ($tileW - $w) / 2
    return New-Object System.Windows.Rect($x, 0, $w, $h)
}

$visual = New-Object System.Windows.Media.DrawingVisual
$context = $visual.RenderOpen()

# Clip pro Kachel, damit die ueberstehende Bildbreite nicht in die Nachbarkachel ragt
$totalWidth = $tileW * 2

$teslaRect = Get-CoverRect $tesla 0
$context.PushClip((New-Object System.Windows.Media.RectangleGeometry((New-Object System.Windows.Rect(0, 0, $tileW, $tileH)))))
$context.DrawImage($tesla, $teslaRect)
$context.Pop()

$fordRect = Get-CoverRect $ford $tileW
$context.PushClip((New-Object System.Windows.Media.RectangleGeometry((New-Object System.Windows.Rect($tileW, 0, $tileW, $tileH)))))
$context.DrawImage($ford, $fordRect)
$context.Pop()

$context.Close()
$targetHeight = $tileH

$rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($totalWidth, $targetHeight, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
$rtb.Render($visual)

$encoder = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
$encoder.QualityLevel = 90
$encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create([System.Windows.Media.Imaging.BitmapSource]$rtb))

$outPath = Join-Path $base "logistik.jpg"
$stream = [System.IO.File]::Open($outPath, [System.IO.FileMode]::Create)
$encoder.Save($stream)
$stream.Close()

Write-Output "Saved: $outPath ($totalWidth x $targetHeight)"
