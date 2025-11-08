import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinMemberForm } from "@/components/forms/JoinMemberForm";
import { CheckCircle, Users, Shield, FileText } from "lucide-react";

export default async function JoinMemberPage() {
  const t = await getTranslations("MembersPage");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Join Build Barguna Co-operative
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Become a founding member of our transparent, community-driven co-operative. 
              Help us build a stronger future together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits Section */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Founding Member Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">Co-design Participation</h4>
                      <p className="text-sm text-muted-foreground">Join sessions to shape our policies and programs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">Priority Access</h4>
                      <p className="text-sm text-muted-foreground">First access to training and pilot programs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">Governance Rights</h4>
                      <p className="text-sm text-muted-foreground">Vote on policies and organizational decisions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">Transparent Updates</h4>
                      <p className="text-sm text-muted-foreground">Regular reports on our progress and finances</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">18+ years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Valid National ID or Passport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Local resident</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Agree to co-operative constitution</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Founding Member Application</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out this form to apply for founding membership. 
                    Your application will be reviewed within 3-7 working days.
                  </p>
                </CardHeader>
                <CardContent>
                  <JoinMemberForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process Timeline */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-center">Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">1</div>
                  <h4 className="font-medium text-foreground">Submit Application</h4>
                  <p className="text-sm text-muted-foreground">Complete and submit the form</p>
                </div>
                
                <div className="hidden md:block w-16 h-0.5 bg-border"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">2</div>
                  <h4 className="font-medium text-foreground">Review & Verification</h4>
                  <p className="text-sm text-muted-foreground">We verify your information</p>
                </div>
                
                <div className="hidden md:block w-16 h-0.5 bg-border"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">3</div>
                  <h4 className="font-medium text-foreground">Orientation</h4>
                  <p className="text-sm text-muted-foreground">Attend member orientation</p>
                </div>
                
                <div className="hidden md:block w-16 h-0.5 bg-border"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">4</div>
                  <h4 className="font-medium text-foreground">Welcome!</h4>
                  <p className="text-sm text-muted-foreground">Receive interim member ID</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}