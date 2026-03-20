import Link from "next/link"
import { Briefcase } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">JobHub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting talented professionals with great opportunities. Find your dream job today.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5">
              <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Companies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2.5">
              <li><Link href="/post-job" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Post a Job</Link></li>
              <li><Link href="/recruiter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recruiter Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 JobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
