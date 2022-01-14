import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.less']
})
export class AboutusComponent implements OnInit {
  subscriptionName
  project;
  desc;
  descDetail;
  sampleData=[
    {
      "product": "FHIR1",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 1. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR2",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 2. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR3",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 3. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR4",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 4. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR5",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 5. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR1",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 1. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR2",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 2. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR3",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 3. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR4",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 4. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    },
    {
      "product": "FHIR5",
      "ProdDesc": "Lorem Ipsum",
      "ProdDetail":" 5. I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above.I am shown when someone hovers over the div above"
    }
  ]

  constructor(private commonService: CommonService) {
    this.subscriptionName = this.commonService.getUpdate().subscribe(item => {
      this.project = item;
      console.log(this.project)

    });

   }

  ngOnInit(): void {
  }
  onHovering(data){
    console.log(data)
    this.desc = this.sampleData.find(function(e) {
      return e.product == data
    })

    this.descDetail = this.desc.ProdDetail;
    console.log(this.desc)
    
  }

 }
