import Capacitor

// The viewport meta tag alone isn't always enough to kill pinch/double-tap
// zoom on WKWebView, so this disables it natively too.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        guard let scrollView = webView?.scrollView else { return }
        scrollView.pinchGestureRecognizer?.isEnabled = false
        scrollView.minimumZoomScale = 1.0
        scrollView.maximumZoomScale = 1.0
        scrollView.bouncesZoom = false
    }
}
